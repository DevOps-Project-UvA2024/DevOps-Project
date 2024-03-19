output "backend_build_project_name" {
  description = "Name of the backend CodeBuild project"
  value       = aws_codebuild_project.backend_build.name
}

output "frontend_build_project_name" {
  description = "Name of the frontend CodeBuild project"
  value       = aws_codebuild_project.frontend_build.name
}