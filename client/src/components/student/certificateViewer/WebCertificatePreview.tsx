import { CheckCircle, Shield } from 'lucide-react'

const WebCertificatePreview = () => {
  const certificateData = {
    student: { name: 'Pavel Novák' },
    course: { name: 'Bezpečnost práce DAAL' },
    company: { name: 'XXX s.r.o' },
    certificate: {
      certificateNumber: 'CERT-COURSE#12J33X77-175177240665$',
      verificationCode: 'ABC123XYZ789',
      issuedAt: '2025-09-13',
    },
  }

  const bestScore = { percentage: '85' }

  return (
    <div className="bg-gray-100 mb-20">
      <div className="">
        {/* Certifikát - landscape formát */}
        <div className="bg-white shadow-2xl mx-auto max-w-6xl" style={{ aspectRatio: '16/10' }}>
          {/* Zelená hlavička */}
          <div
            className="relative overflow-hidden px-8 py-6 flex justify-between items-center"
            style={{
              background: 'linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%)',
              height: '20%',
            }}
          >
            {/* Logo a název */}
            <div className="flex items-center gap-4 text-white z-10">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center border-2"
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  backdropFilter: 'blur(10px)',
                  borderColor: 'rgba(255,255,255,0.3)',
                }}
              >
                <Shield className="w-7 h-7 text-white" />
              </div>

              <div>
                <div className="text-2xl font-bold tracking-wide">DAAL</div>
                <div className="text-sm opacity-90 font-medium">ŠKOLICÍ PLATFORMA</div>
              </div>
            </div>

            {/* Číslo certifikátu */}
            <div className="text-white text-right z-10">
              <div className="text-sm opacity-80 mb-1">Certifikát č.</div>
              <div
                className="text-sm font-bold px-3 py-1 rounded"
                style={{
                  fontFamily: 'Courier New, monospace',
                  background: 'rgba(255,255,255,0.2)',
                }}
              >
                {certificateData.certificate.certificateNumber}
              </div>
            </div>
          </div>

          {/* Hlavní obsah certifikátu */}
          <div className="px-12 py-12 text-center relative flex-1">
            {/* Ikona úspěchu */}
            <div className="flex justify-center mb-8">
              <div
                className="relative w-20 h-20 bg-emerald-50 border-4 border-emerald-500 rounded-full flex items-center justify-center"
                style={{ boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)' }}
              >
                <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            {/* Hlavní nadpis */}
            <div className="mb-10">
              <h1 className="text-5xl font-bold text-gray-800 tracking-wider mb-4">CERTIFIKÁT</h1>

              {/* Dekorativní čára */}
              <div
                className="w-40 h-1 mx-auto rounded mb-4"
                style={{
                  background: 'linear-gradient(90deg, #10b981 0%, #34d399 50%, #10b981 100%)',
                }}
              />

              <p className="text-xl text-emerald-600 font-semibold tracking-widest uppercase">
                O ÚSPĚŠNÉM DOKONČENÍ ŠKOLENÍ
              </p>
            </div>

            {/* Informace o studentovi */}
            <div className="mb-10">
              <p className="text-gray-600 mb-6 text-lg">Tímto se potvrzuje, že</p>

              {/* Jméno studenta v rámečku s dekorativními čarami */}
              <div className="relative mb-8">
                {/* Dekorativní zelené čáry */}
                <div
                  className="absolute left-0 top-1/2 w-32 h-1 -translate-y-1/2"
                  style={{ background: 'linear-gradient(90deg, #10b981, transparent)' }}
                />
                <div
                  className="absolute right-0 top-1/2 w-32 h-1 -translate-y-1/2"
                  style={{ background: 'linear-gradient(270deg, #10b981, transparent)' }}
                />

                <div
                  className="border-2 border-emerald-500 rounded-xl py-6 px-8 mx-auto max-w-lg shadow-lg"
                  style={{
                    background: 'linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 100%)',
                  }}
                >
                  <h3 className="text-4xl font-bold text-gray-800 uppercase tracking-wide">
                    {certificateData.student.name}
                  </h3>
                </div>
              </div>

              <p className="text-gray-600 mb-6 text-lg">úspěšně dokončil(a) školení</p>

              {/* Název kurzu */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg py-4 px-6 mx-auto max-w-xl">
                <h4 className="text-2xl font-bold text-emerald-700 mb-2">{certificateData.course.name}</h4>
                {certificateData.company && (
                  <p className="text-base text-gray-600 italic">
                    pro společnost: <span className="font-semibold text-gray-700">{certificateData.company.name}</span>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Spodní část s podpisem a detaily */}
          <div className="px-12 pb-8 border-t-2 border-gray-100 pt-6 flex justify-between items-end">
            {/* Datum dokončení */}
            <div className="text-left">
              <div className="text-sm text-gray-500 font-semibold uppercase tracking-wide mb-2">DATUM DOKONČENÍ</div>
              <div className="text-2xl font-bold text-gray-800">
                {new Date(certificateData.certificate.issuedAt).toLocaleDateString('cs-CZ', {
                  day: 'numeric',
                  month: 'numeric',
                  year: 'numeric',
                })}
              </div>
            </div>

            {/* Digitální podpis */}
            <div className="text-right">
              <div className="w-48 border-b-2 border-gray-300 mb-2" />
              <div className="text-sm text-gray-600 font-semibold">Digitálně podepsáno</div>
              <div className="text-sm text-gray-400">DAAL Training Platform</div>
            </div>
          </div>

          {/* Zápatí */}
          <div className="text-center py-4 border-t border-gray-100 bg-gray-50">
            <div className="text-sm text-gray-500 flex justify-center items-center gap-4">
              <span className="font-semibold text-gray-700">DAAL Školicí platforma</span>
              <span className="text-gray-300">|</span>
              <span>Praha, Česká republika</span>
              <span className="text-gray-300">|</span>
              <span>Profesionální školení bezpečnosti práce</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WebCertificatePreview
