output "eduapp_db_endpoint" {
  value = aws_db_instance.eduapp_db_instance.address
}

output "eduapp_db_name" {
  value = aws_db_instance.eduapp_db_instance.db_name
}

output "eduapp_db_arn" {
  value = aws_db_instance.eduapp_db_instance.arn
}