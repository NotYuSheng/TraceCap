-- Analysis Results Table
CREATE TABLE IF NOT EXISTS analysis_results (
    id UUID PRIMARY KEY,
    file_id UUID NOT NULL REFERENCES files(id) ON DELETE CASCADE,
    packet_count BIGINT,
    total_bytes BIGINT,
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    duration_ms BIGINT,
    protocol_stats JSONB,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    error_message TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_file FOREIGN KEY (file_id) REFERENCES files(id) ON DELETE CASCADE
);

CREATE INDEX idx_analysis_file_id ON analysis_results(file_id);
CREATE INDEX idx_analysis_status ON analysis_results(status);

-- Conversations Table
CREATE TABLE IF NOT EXISTS conversations (
    id UUID PRIMARY KEY,
    file_id UUID NOT NULL REFERENCES files(id) ON DELETE CASCADE,
    src_ip VARCHAR(45) NOT NULL,
    src_port INTEGER,
    dst_ip VARCHAR(45) NOT NULL,
    dst_port INTEGER,
    protocol VARCHAR(20) NOT NULL,
    packet_count BIGINT NOT NULL DEFAULT 0,
    total_bytes BIGINT NOT NULL DEFAULT 0,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_conv_file_id ON conversations(file_id);
CREATE INDEX idx_conv_src_ip ON conversations(src_ip);
CREATE INDEX idx_conv_dst_ip ON conversations(dst_ip);
CREATE INDEX idx_conv_protocol ON conversations(protocol);

-- Packets Table (for detailed timeline)
CREATE TABLE IF NOT EXISTS packets (
    id UUID PRIMARY KEY,
    file_id UUID NOT NULL REFERENCES files(id) ON DELETE CASCADE,
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    packet_number BIGINT NOT NULL,
    timestamp TIMESTAMP NOT NULL,
    src_ip VARCHAR(45) NOT NULL,
    src_port INTEGER,
    dst_ip VARCHAR(45) NOT NULL,
    dst_port INTEGER,
    protocol VARCHAR(20) NOT NULL,
    packet_size INTEGER NOT NULL,
    info TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_packet_file_id ON packets(file_id);
CREATE INDEX idx_packet_conv_id ON packets(conversation_id);
CREATE INDEX idx_packet_timestamp ON packets(timestamp);
CREATE INDEX idx_packet_number ON packets(file_id, packet_number);

-- Trigger for auto-updating updated_at timestamp
CREATE OR REPLACE FUNCTION update_analysis_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_analysis_updated_at
    BEFORE UPDATE ON analysis_results
    FOR EACH ROW
    EXECUTE FUNCTION update_analysis_updated_at();
