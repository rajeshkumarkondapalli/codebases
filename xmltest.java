import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.xpath.XPath;
import javax.xml.xpath.XPathConstants;
import javax.xml.xpath.XPathExpression;
import javax.xml.xpath.XPathFactory;
import org.w3c.dom.Document;
import org.w3c.dom.NodeList;
import java.io.ByteArrayInputStream;

public class XPathUtils {
    public static int countXPathOccurrences(String xml, String xpathExpression) {
        try {
            // Parse XML while ignoring namespaces
            DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
            factory.setNamespaceAware(false); // Ignore namespaces
            DocumentBuilder builder = factory.newDocumentBuilder();
            Document document = builder.parse(new ByteArrayInputStream(xml.getBytes()));

            // Create XPath
            XPathFactory xPathFactory = XPathFactory.newInstance();
            XPath xpath = xPathFactory.newXPath();

            // Compile and evaluate XPath expression
            XPathExpression expr = xpath.compile(xpathExpression);
            NodeList nodes = (NodeList) expr.evaluate(document, XPathConstants.NODESET);

            // Return the count of matching nodes
            return nodes.getLength();
        } catch (Exception e) {
            e.printStackTrace();
            return 0; // Return 0 in case of an error
        }
    }

    public static void main(String[] args) {
        String xml = "<root xmlns=\"http://example.com\">\n" +
                     "    <item>Value</item>\n" +
                     "    <item>Another Value</item>\n" +
                     "</root>";

        String xpathExpr = "//*[local-name()='item']"; // Ignore namespace
        int count = countXPathOccurrences(xml, xpathExpr);
        System.out.println("XPath occurrences: " + count);
    }
}







import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import java.io.ByteArrayInputStream;

public class Main {
    public static void main(String[] args) {
        String xml = "<root xmlns=\"http://example.com\">\n" +
                     "    <item>Value</item>\n" +
                     "    <item>Another Value</item>\n" +
                     "</root>";

        try {
            // Parse XML
            DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
            factory.setNamespaceAware(false); // Ignore namespaces
            DocumentBuilder builder = factory.newDocumentBuilder();
            Document document = builder.parse(new ByteArrayInputStream(xml.getBytes()));

            // Get root element
            Element rootElement = document.getDocumentElement();

            // Define XPath ignoring namespaces
            String xpathExpr = "//*[local-name()='item']";

            // Get count of occurrences
            int count = XPathUtils.countXPathOccurrences(rootElement, xpathExpr);
            System.out.println("XPath occurrences: " + count);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}