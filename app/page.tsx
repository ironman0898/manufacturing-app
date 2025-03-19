export default async function Home() {
  try {
    const res = await fetch("http://localhost:3000/api/product");
    const data = await res.json();
  } catch (error) {
    console.log(error);
  }

  return (
    <div>
      <h1>Hello App</h1>
    </div>
  );
}
