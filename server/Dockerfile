# Use official Node image
FROM node:18-bullseye

# Install TeX Live (minimal but sufficient)
RUN apt-get update && \
    apt-get install -y texlive-latex-base \
                       texlive-latex-recommended \
                       texlive-latex-extra \
                       texlive-fonts-recommended \
                       texlive-fonts-extra \
                       texlive-lang-english \
                       latexmk \
                       fontconfig \
                       && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install Node dependencies
RUN npm install

# Copy rest of the app
COPY . .

# Expose port
EXPOSE 5000

# Start server
CMD ["node", "index.js"]