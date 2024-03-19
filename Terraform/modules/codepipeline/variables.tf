variable "s3_bucket_for_artifacts" {
  description = "The name of the S3 bucket used for storing pipeline artifacts"
  type        = string
}

variable "role_arn" {
  description = "The ARN of the IAM role for the CodePipeline"
  type        = string
}

variable "backend_build_project_name" {
  description = "The name of the backend build project in CodeBuild"
  type        = string
}

variable "frontend_build_project_name" {
  description = "The name of the frontend build project in CodeBuild"
  type        = string
}

variable "ecs_cluster_name" {
  description = "The name of the ECS cluster"
  type        = string
}

variable "backend_service_name" {
  description = "The name of the ECS service for the backend"
  type        = string
}

variable "frontend_service_name" {
  description = "The name of the ECS service for the frontend"
  type        = string
}
