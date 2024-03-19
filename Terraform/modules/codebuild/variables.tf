variable "codebuild_role_arn" {
  description = "ARN of the IAM role for CodeBuild projects"
  type        = string
}

variable "buildspec_backend" {
  description = "Path to the build specification file for backend"
  type        = string
  default     = "buildspec-backend.yml"
}

variable "buildspec_frontend" {
  description = "Path to the build specification file for frontend"
  type        = string
  default     = "buildspec-frontend.yml"
}