output "backend_repository_url" {
  description = "The repository URL for the backend application"
  value       = aws_ecr_repository.backend_repo.repository_url
}

output "frontend_repository_url" {
  description = "The repository URL for the frontend application"
  value       = aws_ecr_repository.frontend_repo.repository_url
}