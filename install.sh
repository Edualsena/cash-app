#!/bin/bash

# Script para instalar dependências do Cash App

echo "🚀 Instalando dependências do Cash App..."
echo ""

# Instalar backend
echo "📦 Instalando dependências do backend..."
cd backend
npm install
if [ $? -eq 0 ]; then
    echo "✅ Backend instalado com sucesso!"
else
    echo "❌ Erro ao instalar backend"
    exit 1
fi

cd ..

# Instalar frontend
echo ""
echo "📦 Instalando dependências do frontend..."
cd frontend
npm install
if [ $? -eq 0 ]; then
    echo "✅ Frontend instalado com sucesso!"
else
    echo "❌ Erro ao instalar frontend"
    exit 1
fi

cd ..

echo ""
echo "✅ Todas as dependências foram instaladas com sucesso!"
echo ""
echo "🚀 Próximos passos:"
echo ""
echo "1. Abra dois terminais"
echo ""
echo "2. Terminal 1 - Inicie o backend:"
echo "   cd backend && npm run dev"
echo ""
echo "3. Terminal 2 - Inicie o frontend:"
echo "   cd frontend && npm run dev"
echo ""
echo "4. Acesse http://localhost:5173 no seu navegador"
echo ""
