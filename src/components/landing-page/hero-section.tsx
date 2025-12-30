export function HeroSection() {
  return (
    <div className="mb-8">
      {/* Illustration */}
      <div className="mb-8">
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDiUUWkYYL-YycAwX4u5TdCbmn9Z-t77l3qW6tvMbkzIweQrkK22Ni0idf-vf_vluQ73lw6e4E-uWyynyQ5kg4DY3X-jmXRGPHkXACI46YZIg57yTECuN8FLP5uKMnok0eXRsDg21K2TL9GjlfYgz1jZXBh7lavZbyBo3QB61Sx7xZ-a2IKpJZYfJUqk5KQMUB4oIaFjVNQQm9gZ1DKq4wkPSDH6y7F5FuuT6v4qfzi79XWee0AuqsSV_qrxfxTwpw6xZVspD_67wgH"
          alt="Two hands protecting an item"
          className="w-full max-w-sm mx-auto rounded-3xl shadow-lg hover:shadow-xl transition-shadow"
        />
      </div>

      {/* Heading */}
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight tracking-tight">
        You Found Something!
      </h2>

      {/* Description */}
      <p className="text-base text-gray-600 leading-relaxed mb-8 font-medium">
        Thank you for being a good samaritan. Let us help you return this item
        safely.
      </p>
    </div>
  )
}
