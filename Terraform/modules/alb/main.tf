resource "aws_lb_target_group" "front_target" {
  name     = "front-target"
  port     = 80
  protocol = "HTTP"
  vpc_id   = var.vpc_id
  target_type = "ip"

  health_check {
    enabled = true
    path    = "/"
    protocol = "HTTP"
  }
}

resource "aws_lb_target_group" "back_target" {
  name     = "back-target"
  port     = 3001
  protocol = "HTTP"
  vpc_id   = var.vpc_id
  target_type = "ip"

  health_check {
    enabled = true
    path    = "/api/health"
    protocol = "HTTP"
  }
}

resource "aws_lb" "eduapp_alb" {
  name               = "eduapp-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [var.eduapp_lb_sg]
  subnets            = var.public_subnet_ids
  enable_deletion_protection = false
}

# Listener for the ALB
resource "aws_lb_listener" "front_listener" {
  load_balancer_arn = aws_lb.eduapp_alb.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.front_target.arn
  }
}

# Listener rule to forward /api/* to the backend target group
resource "aws_lb_listener_rule" "api_forward" {
  listener_arn = aws_lb_listener.front_listener.arn
  priority     = 100

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.back_target.arn
  }

  condition {
    path_pattern {
      values = ["/api/*"]
    }
  }
}

