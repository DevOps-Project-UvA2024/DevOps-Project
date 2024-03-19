output "alb_arn" {
  description = "The ARN of the ALB"
  value       = aws_lb.eduapp_alb.arn
}

output "alb_dns_name" {
  description = "The DNS name of the ALB"
  value       = aws_lb.eduapp_alb.dns_name
}

output "front_target_group_arn" {
  description = "The ARN of the front target group"
  value       = aws_lb_target_group.front_target.arn
}

output "back_target_group_arn" {
  description = "The ARN of the target group"
  value       = aws_lb_target_group.back_target.arn
}

output "alb_listener" {
  description = "The listener"
  value       = aws_lb_listener.front_listener.arn
}
