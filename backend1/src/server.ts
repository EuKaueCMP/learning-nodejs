import express, { Request, Response } from 'express';

//? Criar uma instância da aplicacao Express
const app = express();

//? Definir a porta que o servidor vai rodar
//? Aqui usamos 3001 para que não haja conflitos com o front-end que usa 3000 ou 5173
//? Não é uma boa prática definir a porta na mão
const PORT = 3001;

//? Iniciando o servidor e fazendo ele "ESCUTAR" requisicoes na porta definida ("3001")
app.listen(PORT, () => {
    console.log(`Running the server on port: http://localhost:${PORT}`)
})

//? Interface dos dados mocados
interface iCarros {
    id: number,
    nome: string,
    ano: number,
    kilometragem: number,
    preco: number
}

//?
//?
//? Dados de carros mocados
let carros: iCarros[] = [
    {
        id: 1,
        nome: 'Fiat uno',
        ano: 1989,
        kilometragem: 1850000,
        preco: 14000
    },
    {
        id: 2,
        nome: 'Fiat Palio fire',
        ano: 2001,
        kilometragem: 2000000,
        preco: 17500
    },
    {
        id: 3,
        nome: 'Volkswagen gol g2',
        ano: 1995,
        kilometragem: 3450000,
        preco: 16000
    },
]

//?
//? Esta linha faz com que o express entenda o formato de resposta em JSON 
//? que é recebido no corpo da requisicao
app.use(express.json());

//?
//? Definindo a rota inicial (caminho endpoits) para o servidor da aplicacao
//? Quando alguem for consumir e acessar a raiz ('/') com o método GET...
app.get('/', (req: Request, res: Response) => {
    //? nós responderemos com um objeto JSON.
    res.json({ message: "Hello world!!!", greeting: "Wellcome to my first NodeJs API!" });
});

//? READ - LISTAR CARROS - Agora testando com a lista de carros
app.get('/carros', (req: Request, res: Response) => {
    //? instanciando o retorno
    res.json( carros );
});

//? READ - OBTER CARRO POR ID - Agora buscando carros por ID
app.get('/carros/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const carro = carros.find(c => c.id == Number(id));

    //? Instanciando o retorno
    res.json( carro );
});

//? CREATE - CRIANDO CARRO - Agora vamos criar um carro novo
app.post('/carros', (req: Request, res: Response) => {
    const lastId: number = carros.at(-1)?.id ?? 0;
    const id = lastId + 1;
    const { nome, ano, kilometragem, preco } = req.body;

    if (!nome || !ano || !kilometragem || !preco) {
        res.status(400).json({ error: "Fill in all fields!" });
        return;
    }

    const novoCarro: iCarros = {
        id: id,
        nome: nome,
        ano: Number(ano),
        kilometragem: Number(kilometragem),
        preco: Number(preco)
    };

    carros.push(novoCarro);
    const carroCriado = carros.find(c => c.id == id);
    res.json(carroCriado);
});

//? UPDATE - EDITAR CARRO - Agora vamos editar um carro por ID
app.put('/carros/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const { nome, ano, kilometragem, preco } = req.body;
    const index = carros.findIndex(c => c.id == Number(id));
    console.log(index);

    if (index === -1) {
        res.status(404).json({ error: "Car not found" })
        return;
    }

    carros[index] = {
        ...carros[index],
        id: Number(id),
        nome: nome || carros[index]?.nome,
        ano: ano || carros[index]?.ano,
        kilometragem: kilometragem || carros[index]?.kilometragem,
        preco: preco || carros[index]?.preco
    };

    res.json("Car succesfully updated.");
});

//? DELETE - REMOVER CARRO - Agora vamos remover um carro por ID
app.delete('/carros/:idz', (req: Request, res: Response) => {
    const { id } = req.params;
    const index = carros.findIndex(c => c.id === Number(id));
    console.log(index)
    if (index === -1) {
        res.status(404).json({ error: "Car not found" });
        return;
    }

    carros.splice(index, 1);
    res.json("Car succesfully deleted.");
    return;
});

