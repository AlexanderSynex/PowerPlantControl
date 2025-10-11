import companyLogo from '../assets/ckt.svg'

export default function NoAccess() {
  return (
    <div className="min-h-dvh bg-gray-100 flex flex-fixed flex-col items-center justify-center">
      <a href="https://creativetechcenter.ru/">
      <img
        src={companyLogo}
        alt="Company Logo"
        className="mb-4 h-20 p-1"
      />
      </a>
      
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Нет доступа</h1>
      <p className="text-center text-gray-600">
        Воспользуйтесь QR-кодом на зарядной станции для получения доступа
      </p>
    </div>
  );
}