server {
    listen 80;
    server_name duopassclub.ch www.duopassclub.ch;
    
    root /var/www/duopass/dist;
    index index.html;
    
    # Proteção Beta - Acesso Restrito
    auth_basic "DUO PASS - Acesso Exclusivo Beta (Contato: admin@duopassclub.ch)";
    auth_basic_user_file /etc/nginx/.htpasswd;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public";
    }
    
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}