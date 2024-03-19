variable "vpc_cidr" {
  description = "The CIDR block for the VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "db_password" {
  type = string
  default = "rootroot"
}

variable "db_username" {
  type = string
  default = "root"
}

variable "buildspec_backend" {
    type = string
    default = "C:/Users/Dimitris/Desktop/DevOps-Project/buildspec-backend.yaml"
}

variable "buildspec_frontend" {
    type = string
    default = "C:/Users/Dimitris/Desktop/DevOps-Project/buildspec-frontend.yaml"
}