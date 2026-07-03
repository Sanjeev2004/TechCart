const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 py-8 text-center text-sm mt-auto">
      <div className="container mx-auto px-4">
        <p>&copy; {new Date().getFullYear()} E-COMM. All rights reserved.</p>
        <p className="mt-2">Built with Next.js, Node.js, and MongoDB.</p>
      </div>
    </footer>
  );
};

export default Footer;
