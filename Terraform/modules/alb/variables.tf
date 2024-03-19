variable "vpc_id" {
  description = "The VPC ID where the ALB will be created"
  type        = string
}

variable "public_subnet_ids" {
  description = "A list of subnet IDs to attach to the ALB (public subnets)"
  type        = list(string)
}

variable "eduapp_lb_sg" {
  description = "Load Balancer's Security Group"
  type        = string
}
