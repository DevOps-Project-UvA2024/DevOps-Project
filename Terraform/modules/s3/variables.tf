variable "bucket_name" {
  description = "The name of the bucket"
  type        = string
}

variable "versioning_enabled" {
  description = "Whether versioning should be enabled on the bucket"
  type        = bool
  default     = false
}

variable "policy" {
  description = "The JSON policy as a string"
  type        = string
}

variable "tags" {
  description = "A map of tags to assign to the bucket"
  type        = map(string)
  default     = {}
}
