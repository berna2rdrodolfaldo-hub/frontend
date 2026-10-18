export interface Comment {
  id: string;
  userName: string;
  text: string;
  timestamp: string;
}

export interface Station {
  id: number;
  name: string;
  location: string;
  open: boolean;
  fuel: boolean;
  queue: number;
  image: string;
  prices: {
    especial: string;
    premium: string;
    diesel: string;
  };
  comments?: Comment[]; // Nueva propiedad opcional para comentarios/reportes del estado
}

export const stations: Station[] = [
  {
    id: 1,
    name: "Surtidor Central",
    location: "Av. Principal, zona Centro",
    open: true,
    fuel: true,
    queue: 8,
    image: "https://images.unsplash.com/photo-1707643824892-c326ef1688a6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHN1cnRpZG9yZXMlMjBnYXNvbGluZXJpYXN8ZW58MHx8MHx8fDA%3D",
    prices: { especial: "Bs 6.74", premium: "Bs 7.18", diesel: "Bs 6.96" },
    comments: []
  },
  {
    id: 2,
    name: "Surtidor Norte",
    location: "Av. Banzer, zona Norte",
    open: true,
    fuel: true,
    queue: 15,
    image: "https://images.unsplash.com/photo-1707960190027-817be78594f8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fHN1cnRpZG9yZXMlMjBnYXNvbGluZXJpYXN8ZW58MHx8MHx8fDA%3D",
    prices: { especial: "Bs 6.74", premium: "Bs 7.18", diesel: "Bs 6.96" },
    comments: []
  },
  {
    id: 3,
    name: "Surtidor Sur",
    location: "Av. Cristo Redentor",
    open: true,
    fuel: true,
    queue: 22,
    image: "https://images.unsplash.com/photo-1615226882893-17520863eb04?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fHN1cnRpZG9yZXMlMjBnYXNvbGluZXJpYXN8ZW58MHx8MHx8fDA%3D",
    prices: { especial: "Bs 6.74", premium: "Bs 7.18", diesel: "Bs 6.96" },
    comments: []
  },
  {
    id: 4,
    name: "Surtidor Este",
    location: "Av. Virgen de Cotoca",
    open: false,
    fuel: false,
    queue: 0,
    image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAA0JCgsKCA0LCgsODg0PEyAVExISEyccHhcgLikxMC4pLSwzOko+MzZGNywtQFdBRkxOUlNSMj5aYVpQYEpRUk8BDg4OExETJhUVJk81LTVPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT//AABEIAKQA9gMBIgACEQEDEQH/xAAbAAABBQEBAAAAAAAAAAAAAAAEAAIDBQYBB//EAEYQAAIBAwICBgYIAwYDCQAAAAECAwAEERIhBTETIkFRYXEGFDKBkaEVIzNCUrHB0SQ0YnKCk+Hw8WNzkgcWJTVDRVNUov/EABgBAQEBAQEAAAAAAAAAAAAAAAABAgME/8QAIhEBAQACAgIDAQADAAAAAAAAAAECERIhAzETXPUiYP/aAAAAAGBAA/A3V3T0886og4jr41NwpUq3t3k3pLwZS1a1pM6mF10R7K5O943c2sp3/q3oAnB/aAt235yAn41Z33E3vLWW3S2kVnGAzcqu5YI1UnByN9z/IUK93JGSq438K4eTh7s3vx23q1eX9twX4v3t1eYqI+Q1Gq9a84/4f2yOnX/AElX/wD391R8T39In5sU/OipJ9/aG2/5fL5101I31Svx2EesT27SAnY0/wDgC445bO6S3kUThsFWlVTke/s7ap5eL30yNE7LpYYOByyM46v+9V8kEckzyMuWZyThTzPL0quS9e5d3kY43OwyD5edbcL03vAOMp4XLE48f3q0fjfDZchbiJvf+m/Kssq3SjClcd25plxG84VZlXbxA2PwqtbfR8bNq20uO8A/tTK+fV4p4310q3GOWT8xSpofU3B7q3XUil17s7fI/CqXpI/xL1855/f3V7eU2+R2G/aedZr0m4eZrcXEQ6ybPj2SvwHLwNa/Xmy8Xm/m1mO3fQG4qfA3/Ch122qXsc/P8ASl7X0/D2/Xz4x8xToiAsw8mX/vTByxTg/wA2O1SOf99/wqfR1x/uJk571vce247/AJChZgGtw2/3f08qOn2gl95Hx/Chm24en+vGtyueX1qI486sOPrm5th2sP191C3By1H3RzcWu22jA+IqXtr/AEUfFp88Ym593wqx4Wf5a5P4aE/aXFp/m3A91E8OP8rdN4GseT6uXk+1fA2O4pA7b42pPswp2MjlXI9fG3To22/4aVdA6w37/ANaVE9qC1i1z5L9b+L+0/a18S048x1f0+tKleg8/J6Y2/l3f9e2f/Ch15N4mlSpl0uX9f9i7X2m/14USv20fl9aVKseX1L9pLz7a7I940/pQy+21KlXmxejxe1S1O35n96X3jSpVqfXf+vS/i/r/v2pUqVK5udf/Z",
    prices: { especial: "Bs 6.74", premium: "Bs 7.18", diesel: "Bs 6.96" },
    comments: []
  },
  {
    id: 5,
    name: "Surtidor Oeste",
    location: "Av. Doble Vía La Guardia",
    open: true,
    fuel: true,
    queue: 5,
    image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAA0JCgsKCA0LCgsODg0PEyAVExISEyccHhcgLikxMC4pLSwzOko+MzZGNywtQFdBRkxOUlNSMj5aYVpQYEpRUk8BDg4OExETJhUVJk81LTVPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT//AABEIALkA9gMBIgACEQEDEQH/xAAbAAABBQEBAAAAAAAAAAAAAAAFAAECAwQGB//EAEYQAAIBAwICBgYIAwYDCQAAAAECAwAEERIhBTETIkFRYXGBBjKRoRQVI0KxwdEzQ1Jy4RZiY4KS8DREU/ElJnOTssLSJP/EABgBAQEBAQEAAAAAAAAAAAAAAAABAgME/8QAJBEBAQACAgIDAAIDAQAAAAAAAAECERIhAzETXPUiYP/aAAAAAGBAA/A3V3T0886og4jr41NwpUq3t3k3pLwZS1a1pM6mF10R7K5O943c2sp3/q3oAnB/aAt235yAn41Z33E3vLWW3S2kVnGAzcqu5YI1UnByN9z/IUK93JGSq438K4eTh7s3vx23q1eX9twX4v3t1eYqI+Q1Gq9a84/4f2yOnX/ElX/D391R8T39In5sU/OipJ9/aG2/5fL5101I31Svx2EesT27SAnY0/DgC445bO6S3kUThsFWlVTke/s7ap5eL30yNE7LpYYOByyM46v+9V8kEckzyMuWZyThTzPL0quS9e5d3kY43OwyD5edbcL03vAOMp4XLE48f3q0fjfDZchbiJvf+m/Kssq3SjClcd25plxG84VZlXbxA2PwqtbfR8bNq20uO8A/tTK+fV4p4310q3GOWT8xSpofU3B7q3XUil17s7fI/CqXpI/xL1855/f3V7eU2+R2G/aedZr0m4eZrcXEQ6ybPj2SvwHLwNa/Xmy8Xm/m1mO3fQG4qfA3/Ch122qXsc/P8ASl7X0/D2/Xz4x8xToiAsw8mX/vTByxTg/wA2O1SOf99/wqfR1x/uJk571vce247/AJChZgGtw2/3f08qOn2gl95Hx/Chm24en+vGtyueX1qI486sOPrm5th2sP191C3By1H3RzcWu22jA+IqXtr/AEUfFp88Ym593wqx4Wf5a5P4aE/aXFp/m3A91E8OP8rdN4GseT6uXk+1fA2O4pA7b42pPswp2MjlXI9fG3To22/4aVdA6w37/ANaVE9qC1i1z5L9b+L+0/a18S048x1f0+tKleg8/J6Y2/l3f9e2f/Ch15N4mlSpl0uX9f9i7X2m/14USv20fl9aVKseX1L9pLz7a7I940/pQy+21KlXmxejxe1S1O35n96X3jSpVqfXf+vS/i/r/v2pUqVK5udf/Z",
    prices: { especial: "Bs 6.74", premium: "Bs 7.18", diesel: "Bs 6.96" },
    comments: []
  },
  {
    id: 6,
    name: "Surtidor Universidad",
    location: "Zona Universitaria",
    open: false,
    fuel: false,
    queue: 0,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZHE_s--1L8oIdwH03jDytWnMXpxYFWDVWPkLlO1Fj9w&s=10",
    prices: { especial: "Bs 6.74", premium: "Bs 7.18", diesel: "Bs 6.96" },
    comments: []
  }
];