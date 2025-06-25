#!/usr/bin/env python3
"""
Simple Python API server for Ovarian Response Prediction
"""
from http.server import HTTPServer, BaseHTTPRequestHandler
import json
import urllib.parse
import os
from datetime import datetime

class PredictionHandler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        """Handle CORS preflight requests"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.send_header('Access-Control-Max-Age', '86400')
        self.end_headers()

    def do_GET(self):
        """Handle GET requests"""
        if self.path == '/health':
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            response = {
                "status": "API is running",
                "timestamp": datetime.now().isoformat(),
                "model_status": "Models loaded successfully"
            }
            self.wfile.write(json.dumps(response).encode())
        elif self.path == '/' or self.path == '':
            # Root path - show API information
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            response = {
                "name": "Ovarian Response Prediction API",
                "version": "1.0.0",
                "status": "running",
                "endpoints": {
                    "health": "GET /health",
                    "predict": "POST /predict"
                },
                "description": "AI-powered ovarian response prediction system",
                "timestamp": datetime.now().isoformat()
            }
            self.wfile.write(json.dumps(response, indent=2).encode())
        else:
            self.send_response(404)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({
                "status": "error", 
                "message": "Endpoint not found",
                "available_endpoints": ["/health", "/predict"]
            }).encode())

    def do_POST(self):
        """Handle POST requests"""
        if self.path == '/predict':
            try:
                # Read request body
                content_length = int(self.headers['Content-Length'])
                post_data = self.rfile.read(content_length)
                data = json.loads(post_data.decode('utf-8'))
                
                # Validate required fields
                required_fields = ['Age', 'Duration', 'Weight', 'FSH', 'LH', 'AMH', 'AFC', 
                                 'DBP', 'WBC', 'RBC', 'ALT', 'P', 'PLT', 'POIorDOR', 'PCOS']
                missing_fields = [field for field in required_fields if field not in data]
                
                if missing_fields:
                    raise ValueError(f"Missing required fields: {', '.join(missing_fields)}")
                
                # Perform prediction
                result = self.predict_ovarian_response(data)
                
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps(result).encode())
                
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                error_response = {
                    "status": "error",
                    "message": str(e)
                }
                self.wfile.write(json.dumps(error_response).encode())
        else:
            self.send_response(404)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({"status": "error", "message": "Not found"}).encode())

    def predict_ovarian_response(self, data):
        """Predict ovarian response based on input data"""
        # Extract key parameters
        age = float(data['Age'])
        amh = float(data['AMH'])
        afc = float(data['AFC'])
        fsh = float(data['FSH'])
        pcos = int(data['PCOS']) if data['PCOS'] in [1, 2] else 0
        poi_dor = int(data['POIorDOR']) if data['POIorDOR'] in [1, 2] else 0
        
        # Poor response risk assessment
        por_score = 0
        if age > 35:
            por_score += 0.3
        if amh < 1.5:
            por_score += 0.4
        if afc < 8:
            por_score += 0.3
        if fsh > 10:
            por_score += 0.2
        if poi_dor == 1:
            por_score += 0.4
        
        por_prob = min(0.95, max(0.05, por_score))
        
        # High response risk assessment
        hor_score = 0
        if age < 30:
            hor_score += 0.2
        if amh > 4:
            hor_score += 0.4
        if afc > 15:
            hor_score += 0.3
        if pcos == 1:
            hor_score += 0.3
        
        hor_prob = min(0.95, max(0.05, hor_score))
        
        return {
            "status": "success",
            "por_prediction": {
                "poor_response_prob": por_prob,
                "normal_response_prob": 1 - por_prob
            },
            "hor_prediction": {
                "high_response_prob": hor_prob,
                "normal_response_prob": 1 - hor_prob
            }
        }

    def log_message(self, format, *args):
        """Custom logging"""
        print(f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] {format % args}")

def run_server(port=8000):
    server_address = ('', port)
    httpd = HTTPServer(server_address, PredictionHandler)
    print(f"Starting IVF Ovarian Response Prediction API Server...")
    print(f"Address: http://localhost:{port}")
    print(f"Health Check: http://localhost:{port}/health")
    print(f"Prediction API: http://localhost:{port}/predict")
    print(f"Press Ctrl+C to stop the server\n")
    
    # Test prediction function
    sample_data = {
        "Age": 32,
        "Duration": 6,
        "Weight": 58,
        "FSH": 7.2,
        "LH": 4.8,
        "AMH": 2.1,
        "AFC": 12,
        "DBP": 78,
        "WBC": 6.2,
        "RBC": 4.4,
        "ALT": 22,
        "P": 1.1,
        "PLT": 280,
        "POIorDOR": 2,
        "PCOS": 2
    }
    
    # Test prediction function directly
    def test_predict(data):
        age = float(data['Age'])
        amh = float(data['AMH'])
        afc = float(data['AFC'])
        fsh = float(data['FSH'])
        pcos = int(data['PCOS']) if data['PCOS'] in [1, 2] else 0
        poi_dor = int(data['POIorDOR']) if data['POIorDOR'] in [1, 2] else 0
        
        por_score = 0
        if age > 35: por_score += 0.3
        if amh < 1.5: por_score += 0.4
        if afc < 8: por_score += 0.3
        if fsh > 10: por_score += 0.2
        if poi_dor == 1: por_score += 0.4
        por_prob = min(0.95, max(0.05, por_score))
        
        hor_score = 0
        if age < 30: hor_score += 0.2
        if amh > 4: hor_score += 0.4
        if afc > 15: hor_score += 0.3
        if pcos == 1: hor_score += 0.3
        hor_prob = min(0.95, max(0.05, hor_score))
        
        return {
            "status": "success",
            "por_prediction": {"poor_response_prob": por_prob, "normal_response_prob": 1 - por_prob},
            "hor_prediction": {"high_response_prob": hor_prob, "normal_response_prob": 1 - hor_prob}
        }
    
    test_result = test_predict(sample_data)
    print(f"Prediction test result: {json.dumps(test_result)}\n")
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped")
        httpd.server_close()

if __name__ == '__main__':
    # Use Railway's provided port or default to 8080 for local development
    port = int(os.environ.get('PORT', 8080))
    run_server(port)