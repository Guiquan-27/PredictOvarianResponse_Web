library(tidymodels)
library(xgboost)

# Check if the issue is the predict method registration
load("E:/BaiduNetdiskWorkspace/Ovarian_response/web_implementation/shiny_ovarianresp/forshiny.RData")

# Try extracting the raw xgboost model and predicting manually
wf <- pordm_final_wfversion
rec <- extract_recipe(wf)
mod <- extract_fit_parsnip(wf)
raw_xgb <- mod$fit

cat("Raw xgb class:", class(raw_xgb), "\n")
cat("Recipe steps:", paste(sapply(rec$steps, function(s) class(s)[1]), collapse=", "), "\n")

# Try with demo data
cat("\nDemo data structure:\n")
str(demo.data)
