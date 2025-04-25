import Link from 'next/link'
 
export default function NotFound() {
  return (
    <div className='flex flex-col items-center justify-center h-screen gap-10'>
      <h2 className='font-bold text-4xl'>404</h2>
      <p>Não foi possível encontrar este recurso.</p>
      <Link href="/" className='text-blue-500 underline hover:text-blue-600'>Voltar ao Início</Link>
    </div>
  )
}