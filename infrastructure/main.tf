resource "aws_dynamodb_table" "peafsgjpy" {
  name           = var.portfolio_id
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "security"
  table_class    = "STANDARD"
  
  attribute {
    name = "security"
    type = "S"
  }
  
  deletion_protection_enabled = false
  
  warm_throughput {
    read_units_per_second  = 12000
    write_units_per_second = 4000
    status                 = "ACTIVE"
  }
}