output "eduapp_pipeline_id" {
  description = "The ID of the eduapp CodePipeline"
  value       = aws_codepipeline.eduapp_pipeline.id
}

output "eduapp_pipeline_arn" {
  description = "The ARN of the eduapp CodePipeline"
  value       = aws_codepipeline.eduapp_pipeline.arn
}