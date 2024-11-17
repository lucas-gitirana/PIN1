import React, { useEffect, useState } from 'react';
import BotaoPadrao from '../BotaoPadrao';
import CardTotalPedido from '../CardTotalPedido';
import GridProdutosCarrinho from '../GridProdutosCarrinho';
import './MeuCarrinho.css';

const MeuCarrinho = () => {
    const [cabecalho] = useState([
        { titulo: 'Produto', classes: 'w-50 al-e' },
        { titulo: 'Preço', classes: 'w-15 al-e' },
        { titulo: 'Quantidade', classes: 'w-15 al-c' },
        { titulo: 'Subtotal', classes: 'w-15 al-c' },
    ]);

    const [itens, setItens] = useState([]);
    const [subtotal, setSubtotal] = useState(0);
    const [frete] = useState(27.9);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        const fetchCarrinho = async () => {
            try {
                // Buscar o usuarioId do endpoint /usuario/status
                const responseStatus = await fetch('http://localhost:8080/usuario/status');
                if (!responseStatus.ok) {
                    throw new Error('Falha ao obter o status do usuário.');
                }
                const statusData = await responseStatus.json();
                const usuarioId = statusData.usuarioId;

                if (!usuarioId) {
                    throw new Error('Usuário não autenticado.');
                }

                // Buscar itens do carrinho para o usuarioId
                const responseCarrinho = await fetch(`http://localhost:8080/carrinho/user/${usuarioId}`);
                if (!responseCarrinho.ok) {
                    throw new Error('Falha ao obter o carrinho do usuário.');
                }
                const carrinhoData = await responseCarrinho.json();

                // Buscar detalhes de cada produto no carrinho
                const produtosPromises = carrinhoData.map(async (item) => {
                    const responseProduto = await fetch(`http://localhost:8080/produto/${item.produtoCodigo}`);
                    const produtoData = await responseProduto.json();
                    return {
                        id: item.codigo,
                        nome: produtoData.descricao,
                        preco: produtoData.preco,
                        quantidade: item.quantidade,
                        subtotal: produtoData.preco * item.quantidade,
                    };
                });

                const produtos = await Promise.all(produtosPromises);

                // Atualizar os itens do carrinho
                setItens(
                    produtos.map((produto) => ({
                        IdItem: produto.id,
                        dadosGrid: [
                            { valor: produto.nome, classes: 'w-50 al-e' },
                            { valor: `R$ ${produto.preco.toFixed(2)}`, classes: 'w-15 al-e' },
                            { valor: produto.quantidade, classes: 'w-15 al-c' },
                            { valor: `R$ ${produto.subtotal.toFixed(2)}`, classes: 'w-15 al-c' },
                        ],
                    }))
                );

                // Atualizar subtotal e total
                const subtotal = produtos.reduce((acc, item) => acc + item.subtotal, 0);
                setSubtotal(subtotal);
                setTotal(subtotal + frete);
            } catch (error) {
                console.error('Erro ao carregar os itens do carrinho:', error);
            }
        };

        fetchCarrinho();
    }, [frete]);

    return (
        <section className="meu-carrinho">
            <h1>Meu Carrinho</h1>
            <GridProdutosCarrinho cabecalho={cabecalho} itens={itens} />
            <div className="meu-carrinho__total">
                <CardTotalPedido
                    subtotal={`R$ ${subtotal.toFixed(2)}`}
                    frete={`R$ ${frete.toFixed(2)}`}
                    total={`R$ ${total.toFixed(2)}`}
                >
                    <BotaoPadrao titulo="Realizar Pagamento" link="/detalhes-pedido" />
                </CardTotalPedido>
            </div>
        </section>
    );
};

export default MeuCarrinho;