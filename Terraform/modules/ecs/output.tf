output "ecs_cluster_id" {
  description = "The ID of the ECS cluster"
  value       = aws_ecs_cluster.eduapp_cluster.id
}

output "ecs_cluster_name" {
  description = "The Name of the ECS cluster"
  value = aws_ecs_cluster.eduapp_cluster.name
}

output "backend_task_definition_arn" {
  description = "The ARN of the task definition for the backend service"
  value       = aws_ecs_task_definition.backend_task.arn
}

output "frontend_task_definition_arn" {
  description = "The ARN of the task definition for the frontend service"
  value       = aws_ecs_task_definition.frontend_task.arn
}

output "backend_service_name" {
  description = "The name of the backend service"
  value       = aws_ecs_service.backend_service.name
}

output "frontend_service_name" {
  description = "The name of the frontend service"
  value       = aws_ecs_service.frontend_service.name
}
