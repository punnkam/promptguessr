import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document';

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html className="h-full">
        {' '}
        // This is where you add the class to the html tag of your page
        <Head />
        <body className="h-full">
          {' '}
          // This is where you add the class to the body tag of your page
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
