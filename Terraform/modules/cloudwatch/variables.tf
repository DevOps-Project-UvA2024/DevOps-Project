variable "cluster_name" {
  description = "Name of the ECS Cluster"
  type        = string
}

variable "service_frontend_name" {
  description = "The name for the ECS Frontend Service"
  type        = string
}

variable "service_backend_name" {
  description = "The name for the ECS Backend Service"
  type        = string
}