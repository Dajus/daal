import { Award, CheckCircle, Shield } from 'lucide-react'

const WebCertificatePreview = () => {
  const certificateData = {
    student: { name: 'Jan Novák' },
    course: { name: 'Bezpečnost práce a ochrana zdraví při práci' },
    company: { name: 'DAAL Technology s.r.o.' },
    certificate: {
      certificateNumber: 'DAAL-2025-001234',
      verificationCode: 'ABC123XYZ789',
      issuedAt: '2025-08-11',
    },
  }

  const bestScore = { percentage: '95' }

  return (
    <div className="bg-gray-100 mb-20">
      <div className="">
        {/* Certifikát - responzivní verze */}
        <div className="bg-white shadow-2xl mx-auto max-w-5xl" style={{ aspectRatio: '297/210' }}>
          {/* Hlavička s gradientním pozadím */}
          <div
            className="relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%)',
              height: '38%',
            }}
          >
            {/* Dekorativní prvky v pozadí */}
            <div
              className="absolute border-2 rounded-full opacity-20"
              style={{
                top: '-10%',
                right: '-15%',
                width: '30%',
                height: '80%',
                borderColor: 'rgba(255,255,255,0.3)',
              }}
            />
            <div
              className="absolute border-2 rounded-full opacity-10"
              style={{
                bottom: '-20%',
                left: '-20%',
                width: '40%',
                height: '100%',
                borderColor: 'rgba(255,255,255,0.3)',
              }}
            />

            {/* Logo a název */}
            <div className="absolute top-6 left-6 text-white z-10">
              <div className="flex items-center gap-3">
                {/* Logo ikona */}
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center border-2"
                  style={{
                    background: 'rgba(255,255,255,0.2)',
                    backdropFilter: 'blur(10px)',
                    borderColor: 'rgba(255,255,255,0.3)',
                  }}
                >
                  <Shield className="w-6 h-6 text-white" />
                </div>

                <div>
                  <div className="text-xl font-bold tracking-wide">DAAL</div>
                  <div className="text-xs opacity-90 font-medium">ŠKOLICÍ PLATFORMA</div>
                </div>
              </div>
            </div>

            {/* Číslo certifikátu */}
            <div className="absolute top-6 right-6 text-white text-right z-10">
              <div className="text-xs opacity-80 mb-1">Certifikát č.</div>
              <div
                className="text-xs font-bold px-2 py-1 rounded"
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
          <div className="px-12 py-8 text-center relative" style={{ marginTop: '-5%' }}>
            {/* Ikona úspěchu */}
            <div className="flex justify-center mb-6">
              <div
                className="relative w-16 h-16 bg-emerald-50 border-4 border-emerald-500 rounded-full flex items-center justify-center"
                style={{ boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)' }}
              >
                <Award className="w-8 h-8 text-emerald-600" />

                {/* Checkmark badge */}
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-600 border-2 border-white rounded-full flex items-center justify-center">
                  <CheckCircle className="w-3 h-3 text-white" />
                </div>
              </div>
            </div>

            {/* Hlavní nadpis */}
            <div className="mb-8">
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 tracking-wider mb-2">CERTIFIKÁT</h1>

              {/* Dekorativní čára */}
              <div
                className="w-32 h-1 mx-auto rounded mb-3"
                style={{
                  background: 'linear-gradient(90deg, #10b981 0%, #34d399 50%, #10b981 100%)',
                }}
              />

              <p className="text-lg text-emerald-600 font-semibold tracking-widest uppercase">
                O úspěšném dokončení školení
              </p>
            </div>

            {/* Informace o studentovi */}
            <div className="mb-8">
              <p className="text-gray-600 mb-6">Tímto se potvrzuje, že</p>

              {/* Jméno studenta v rámečku */}
              <div
                className="border-2 border-emerald-500 rounded-xl py-4 px-6 mx-auto mb-6 max-w-md shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 100%)',
                }}
              >
                <h3 className="text-2xl lg:text-3xl font-bold text-gray-800 uppercase tracking-wide">
                  {certificateData.student.name}
                </h3>
              </div>

              <p className="text-gray-600 mb-4">úspěšně dokončil(a) školení</p>

              {/* Název kurzu */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg py-3 px-4 mx-auto max-w-2xl">
                <h4 className="text-xl lg:text-2xl font-bold text-emerald-700 mb-2">{certificateData.course.name}</h4>

                {certificateData.company && (
                  <p className="text-sm text-gray-600 italic">
                    pro společnost: <span className="font-semibold text-gray-700">{certificateData.company.name}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Skóre box */}
            {bestScore && (
              <div
                className="border-2 border-green-300 rounded-xl py-4 px-6 mx-auto mb-8 max-w-md flex justify-center items-center gap-6"
                style={{
                  background: 'linear-gradient(135deg, #d1fae5 0%, #ecfdf5 100%)',
                }}
              >
                <div className="text-center">
                  <div className="text-3xl font-bold text-emerald-600">{bestScore.percentage}%</div>
                  <div className="text-xs text-emerald-700 font-semibold">ÚSPĚŠNOST</div>
                </div>

                <div className="w-px h-10 bg-emerald-400" />

                <div className="text-center">
                  <div className="text-xl font-bold text-emerald-600">SPLNĚNO</div>
                  <div className="text-xs text-emerald-700 font-semibold">HODNOCENÍ</div>
                </div>
              </div>
            )}
          </div>

          {/* Spodní část s podpisem a detaily */}
          <div className="px-12 pb-8 border-t-2 border-gray-100 pt-6">
            {/* Datum a podpis */}
            <div className="flex justify-between items-end mb-6">
              <div className="text-left">
                <div className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">Datum dokončení</div>
                <div className="text-lg font-bold text-gray-800">
                  {new Date(certificateData.certificate.issuedAt).toLocaleDateString('cs-CZ', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </div>
              </div>

              <div className="text-center">
                <div className="w-40 border-b-2 border-gray-300 mb-1" />
                <div className="text-xs text-gray-600 font-semibold">Digitálně podepsáno</div>
                <div className="text-xs text-gray-400">DAAL Training Platform</div>
              </div>
            </div>

            {/* Ověřovací informace */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex justify-between items-center">
              <div>
                <div className="text-xs font-semibold text-gray-700 mb-1">OVĚŘENÍ CERTIFIKÁTU</div>
                <div className="text-xs text-gray-600 mb-1">
                  Ověřovací kód:{' '}
                  <span className="font-bold font-mono text-gray-800">
                    {certificateData.certificate.verificationCode}
                  </span>
                </div>
                <div className="text-xs text-gray-400">Ověřte online na: www.daal.cz/verify</div>
              </div>

              {/* QR kód placeholder */}
              <div className="w-12 h-12 bg-white border-2 border-gray-200 rounded flex items-center justify-center">
                <div className="grid grid-cols-3 gap-px">
                  {[...Array(9)].map((_, i) => (
                    <div key={i} className={`w-1 h-1 ${i % 2 === 0 ? 'bg-gray-800' : 'bg-white'} rounded-sm`} />
                  ))}
                </div>
              </div>
            </div>

            {/* Zápatí */}
            <div className="text-center mt-4 pt-4 border-t border-gray-100">
              <div className="text-xs text-gray-500">
                <strong className="text-gray-700">DAAL Školicí platforma</strong>
                <span className="mx-2 text-gray-300">|</span>
                Praha, Česká republika
                <span className="mx-2 text-gray-300">|</span>
                Profesionální školení bezpečnosti práce
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WebCertificatePreview
