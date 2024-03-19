output "ecs_s3_access_role_arn" {
  description = "The ARN of the ECS-S3-ACCESS IAM role"
  value       = aws_iam_role.ecs_s3_access.arn
}

output "codebuild_role_arn" {
  description = "The ARN of the CodeBuild IAM role"
  value       = aws_iam_role.codebuild_role.arn
}

output "lambda_role_arn" {
  description = "The ARN of the Lambda IAM role"
  value       = aws_iam_role.lambda_exec.arn
}

output "codepipeline_role_arn" {
  description = "The ARN of the Codepipeline IAM role"
  value       = aws_iam_role.codepipeline_role.arn
}