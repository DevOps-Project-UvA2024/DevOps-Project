variable "lambda_role_arn" {
  description = "The ARN of the IAM role that the Lambda function will assume"
  type        = string
}

variable "eduapp_ecr_sg_id" {
  type = string
}

variable "private_subnet_ids" {
  description = "List of private subnet IDs for the Lambda function to access resources in a VPC"
  type        = list(string)
}

variable "security_group_id" {
  description = "Security group ID for the Lambda function"
  type        = string
}

variable "db_username" {
  description = "Username for the database connection"
  type        = string
}

variable "db_endpoint" {
    description = "RDS Endpoint"
    type        = string
}

variable "db_password" {
  description = "Password for the database connection"
  type        = string
}
