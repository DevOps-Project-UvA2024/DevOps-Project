output "lb_sg_id" {
  description = "The ID of the load balancer security group"
  value       = aws_security_group.eduapp_lb_sg.id
}

output "backend_sg_id" {
  description = "The ID of the backend security group"
  value       = aws_security_group.eduapp_backend_sg.id
}

output "ecr_sg_id" {
  description = "The ID of the backend security group"
  value       = aws_security_group.eduapp_ecr_sg.id
}

output "rds_sg_id" {
  description = "The ID of the backend security group"
  value       = aws_security_group.eduapp_rds_sg.id
}