resource "aws_ecs_cluster" "eduapp_cluster" {
  name = "eduapp-cluster"
}

resource "aws_ecs_task_definition" "backend_task" {
  family                   = "backend-task"
  cpu                      = "256"
  memory                   = "1024"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  task_role_arn            = var.task_execution_role
  execution_role_arn       = var.task_execution_role
  runtime_platform {
    cpu_architecture        = "X86_64"
    operating_system_family = "LINUX"
  }

  container_definitions = jsonencode([
    {
      name               = "backend-1"
      image              = "${var.backend_image}"
      cpu                = 256
      memory             = 1024
      memoryReservation  = 512
      portMappings = [
        {
          containerPort = 3001
          hostPort      = 3001
          protocol      = "tcp"
        }
      ]
      essential          = true
      environmentFiles = [
        {
          value = "${var.cred_env_s3_arn}",
          type  = "s3"
        }
      ]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-create-group"  = "true"
          "awslogs-group"         = "/ecs/backend-task"
          "awslogs-region"        = "eu-north-1"
          "awslogs-stream-prefix" = "ecs"
        }
      }
    }
  ])
}

resource "aws_ecs_task_definition" "frontend_task" {
  family                   = "frontend-task"
  cpu                      = "256"
  memory                   = "1024"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  task_role_arn            = var.task_execution_role
  execution_role_arn       = var.task_execution_role
  runtime_platform {
    cpu_architecture        = "X86_64"
    operating_system_family = "LINUX"
  }

  container_definitions = jsonencode([
    {
      name               = "frontend-1"
      image              = "${var.frontend_image}"
      cpu                = 256
      memory             = 1024
      memoryReservation  = 1024
      portMappings = [
        {
          containerPort = 80
          hostPort      = 80
          protocol      = "tcp"
        },
        {
          containerPort = 443
          hostPort      = 443
          protocol      = "tcp"
        }
      ]
      essential          = true
      environmentFiles = [
        {
          value = "${var.cred_env_s3_arn}",
          type  = "s3"
        }
      ]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-create-group"  = "true"
          "awslogs-group"         = "/ecs/frontend-task"
          "awslogs-region"        = "eu-north-1"
          "awslogs-stream-prefix" = "ecs"
        }
      }
    }
  ])
}


resource "aws_ecs_service" "backend_service" {
  name            = "backend-service"
  cluster         = aws_ecs_cluster.eduapp_cluster.id
  task_definition = aws_ecs_task_definition.backend_task.arn
  desired_count   = 10
  launch_type     = "FARGATE"

  network_configuration {
    subnets         = var.private_subnet_ids
    security_groups = [var.backend_sg_id]
    assign_public_ip = false
  }

  load_balancer {
    target_group_arn = var.backend_target_group_arn
    container_name   = "backend-1"
    container_port   = 3001
  }

  depends_on = [var.frontend_listener_arn]
}

resource "aws_ecs_service" "frontend_service" {
  name            = "frontend-service"
  cluster         = aws_ecs_cluster.eduapp_cluster.id
  task_definition = aws_ecs_task_definition.frontend_task.arn
  desired_count   = 10
  launch_type     = "FARGATE"

  network_configuration {
    subnets         = var.public_subnet_ids
    security_groups = [var.frontend_sg_id]
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = var.frontend_target_group_arn
    container_name   = "frontend-1"
    container_port   = 80
  }

  depends_on = [var.frontend_listener_arn]
}

resource "aws_appautoscaling_target" "ecs_service_target_frontend" {
  max_capacity       = 20
  min_capacity       = 10
  resource_id        = "service/${aws_ecs_cluster.eduapp_cluster.name}/${aws_ecs_service.frontend_service.name}"
  scalable_dimension = "ecs:service:DesiredCount"
  service_namespace  = "ecs"
}

resource "aws_appautoscaling_target" "ecs_service_target_backend" {
  max_capacity       = 20
  min_capacity       = 10
  resource_id        = "service/${aws_ecs_cluster.eduapp_cluster.name}/${aws_ecs_service.backend_service.name}"
  scalable_dimension = "ecs:service:DesiredCount"
  service_namespace  = "ecs"
}

resource "aws_appautoscaling_policy" "ecs_service_scale_out_frontend" {
  name               = "scale-out-${aws_ecs_service.frontend_service.name}"
  service_namespace  = "ecs"
  resource_id        = aws_appautoscaling_target.ecs_service_target_frontend.resource_id
  scalable_dimension = "ecs:service:DesiredCount"
  policy_type        = "TargetTrackingScaling"

  target_tracking_scaling_policy_configuration {
    target_value       = 70
    scale_in_cooldown  = 60
    scale_out_cooldown = 60
    predefined_metric_specification {
      predefined_metric_type = "ECSServiceAverageCPUUtilization"
    }
  }
}

resource "aws_appautoscaling_policy" "ecs_service_scale_out_backend" {
  name               = "scale-out-${aws_ecs_service.backend_service.name}"
  service_namespace  = "ecs"
  resource_id        = aws_appautoscaling_target.ecs_service_target_backend.resource_id
  scalable_dimension = "ecs:service:DesiredCount"
  policy_type        = "TargetTrackingScaling"

  target_tracking_scaling_policy_configuration {
    target_value       = 70
    scale_in_cooldown  = 60
    scale_out_cooldown = 60
    predefined_metric_specification {
      predefined_metric_type = "ECSServiceAverageCPUUtilization"
    }
  }
}
