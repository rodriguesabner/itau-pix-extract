interface ExtractProps {
    id: string
    name: string
    cpf: string
    banco: string
    descricao: string
    valor: string
    data: string
}

interface ResponseItauProps {
    _: string
    price: string
    raw: string
}

export {
  ExtractProps,
  ResponseItauProps,
};
