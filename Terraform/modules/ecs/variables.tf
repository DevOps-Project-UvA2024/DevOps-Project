variable "backend_image" {
  description = "The image URL for the backend container"
  type        = string
}

variable "frontend_image" {
  description = "The image URL for the frontend container"
  type        = string
}

variable "task_execution_role" {
  type        = string
}

variable "private_subnet_ids" {
  description = "A list of IDs for the private subnets in the VPC"
  type        = list(string)
}

variable "public_subnet_ids" {
  description = "A list of IDs for the public subnets in the VPC"
  type        = list(string)
}

variable "frontend_sg_id" {
  description = "The ID of the security group for the backend service"
  type        = string
}

variable "backend_sg_id" {
  description = "The ID of the security group for the backend service"
  type        = string
}

variable "frontend_target_group_arn" {
  description = "The ARN of the target group for the frontend service"
  type        = string
}

variable "backend_target_group_arn" {
  description = "The ARN of the target group for the backend service"
  type        = string
}

variable "frontend_listener_arn" {
  description = "The ARN of the listener for the frontend service"
  type        = string
}

variable "cred_env_s3_arn" {
  type = string
}