variable "db_password" {
  type = string
}

variable "private_subnet_ids" {
  description = "List of IDs for private subnets"
  type        = list(string)
}

variable "rds_security_group_id" {
  description = "Security group ID for the RDS instance"
  type        = string
}