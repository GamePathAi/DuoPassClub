-- Analytics Agent Schema for DUO PASS Club
-- Business Intelligence tables with RLS policies

-- Table for storing calculated business metrics
CREATE TABLE IF NOT EXISTS business_metrics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  metric_name VARCHAR(100) NOT NULL,
  metric_value DECIMAL(15,2) NOT NULL,
  metric_type VARCHAR(50) NOT NULL, -- 'growth', 'voucher_performance', 'partner_analysis', 'seasonal'
  period_type VARCHAR(20) NOT NULL, -- 'daily', 'weekly', 'monthly', 'yearly'
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  comparison_value DECIMAL(15,2), -- Previous period value for comparison
  percentage_change DECIMAL(5,2), -- Percentage change from previous period
  metadata JSONB, -- Additional context data
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table for storing AI-generated business insights
CREATE TABLE IF NOT EXISTS business_insights (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  insight_type VARCHAR(50) NOT NULL, -- 'performance', 'optimization', 'prediction', 'alert'
  priority_level VARCHAR(20) NOT NULL, -- 'critical', 'warning', 'info'
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  recommendations TEXT,
  affected_metrics TEXT[], -- Array of metric names this insight relates to
  confidence_score DECIMAL(3,2), -- AI confidence level (0.00 to 1.00)
  period_analyzed VARCHAR(50) NOT NULL,
  data_context JSONB, -- Raw data used for analysis
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance optimization
CREATE INDEX IF NOT EXISTS idx_business_metrics_type_period ON business_metrics(metric_type, period_type, period_start);
CREATE INDEX IF NOT EXISTS idx_business_metrics_name_date ON business_metrics(metric_name, period_start DESC);
CREATE INDEX IF NOT EXISTS idx_business_insights_type_priority ON business_insights(insight_type, priority_level);
CREATE INDEX IF NOT EXISTS idx_business_insights_active_created ON business_insights(is_active, created_at DESC);

-- Enable Row Level Security
ALTER TABLE business_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_insights ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Only admins can access analytics data
CREATE POLICY "Admin only access to business_metrics" ON business_metrics
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.user_type = 'admin'
    )
  );

CREATE POLICY "Admin only access to business_insights" ON business_insights
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.user_type = 'admin'
    )
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for automatic timestamp updates
CREATE TRIGGER update_business_metrics_updated_at BEFORE UPDATE ON business_metrics
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_business_insights_updated_at BEFORE UPDATE ON business_insights
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Sample data types for metrics
COMMENT ON TABLE business_metrics IS 'Stores calculated business metrics and KPIs';
COMMENT ON TABLE business_insights IS 'Stores AI-generated business insights and recommendations';

-- Metric types reference:
-- growth: new_users, user_growth_rate, retention_rate, churn_rate
-- voucher_performance: vouchers_created, vouchers_used, usage_rate, avg_time_to_use, expired_vouchers
-- partner_analysis: partner_performance, category_popularity, revenue_per_partner, conversion_rate
-- seasonal: monthly_trends, weekly_patterns, peak_periods, seasonal_correlations