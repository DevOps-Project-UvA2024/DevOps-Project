variable "vpc_id" {
  description = "ID of the VPC"
  type        = string
}

variable "eduapp_nat_gateway_id" {
  description = "ID of the NAT Gateway"
  type        = string
}

variable "eduapp_private_subnet_1_id" {
  type = string
}

variable "eduapp_private_subnet_2_id" {
  type = string
}
