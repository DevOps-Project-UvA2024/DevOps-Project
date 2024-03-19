output "cognito_user_pool_id" {
  value = aws_cognito_user_pool.eduapp_user_pool.id
}

output "cognito_client_id" {
  value = aws_cognito_user_pool_client.eduapp_user_pool_client.id
}