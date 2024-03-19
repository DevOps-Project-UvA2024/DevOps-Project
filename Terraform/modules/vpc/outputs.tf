output "vpc_id" {
  description = "The ID of the VPC"
  value       = aws_vpc.eduapp_vpc.id
}

output "public_subnet_ids" {
  description = "IDs of the public subnets"
  value       = [aws_subnet.eduapp_public_subnet_1.id, aws_subnet.eduapp_public_subnet_2.id]
}

output "private_subnet_ids" {
  description = "IDs of the private subnets"
  value       = [aws_subnet.eduapp_private_subnet_1.id, aws_subnet.eduapp_private_subnet_2.id]
}

output "nat_gateway_id" {
  description = "The ID of the NAT Gateway"
  value       = aws_nat_gateway.eduapp_nat_gateway.id
}
