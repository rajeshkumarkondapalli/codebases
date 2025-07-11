import org.opendaylight.netconf.api.NetconfMessage;
import org.opendaylight.netconf.client.NetconfClient;
import org.opendaylight.netconf.client.NetconfClientDispatcher;
import org.opendaylight.netconf.client.NetconfClientSession;
import org.opendaylight.netconf.client.conf.NetconfClientConfiguration;
import org.opendaylight.netconf.client.conf.NetconfClientConfigurationBuilder;
import org.opendaylight.netconf.nettyutil.handler.ssh.client.NetconfSSHClient;
import org.opendaylight.netconf.nettyutil.handler.ssh.client.NetconfSSHClientConfiguration;
import org.opendaylight.yangtools.util.concurrent.FluentFutures;

import java.net.InetSocketAddress;
import java.util.concurrent.ExecutionException;

public class NetconfEditAndGet {

    public static void main(String[] args) throws ExecutionException, InterruptedException {
        // Step 1: Build the NETCONF client configuration
        NetconfClientConfiguration config = NetconfClientConfigurationBuilder.create()
                .withAddress(new InetSocketAddress("127.0.0.1", 1830))
                .withCredentials("admin", "admin")
                .withReconnectStrategy(NetconfClientConfiguration.ReconnectStrategy.DISABLED)
                .build();

        // Step 2: Create the client and connect
        NetconfClient client = new NetconfClient(NetconfClientDispatcher.createClientDispatcher());
        FluentFutures.FluentFuture<NetconfClientSession> futureSession = client.connect(config);
        NetconfClientSession session = futureSession.get();

        // Step 3: Send edit-config
        String editConfigXml = """
                <rpc xmlns="urn:ietf:params:xml:ns:netconf:base:1.0" message-id="101">
                  <edit-config>
                    <target><running/></target>
                    <config>
                      <interfaces xmlns="urn:ietf:params:xml:ns:yang:ietf-interfaces">
                        <interface>
                          <name>eth0</name>
                          <enabled>true</enabled>
                        </interface>
                      </interfaces>
                    </config>
                  </edit-config>
                </rpc>
                """;

        NetconfMessage editConfigMsg = new NetconfMessage(XmlUtil.readXmlToDocument(editConfigXml));
        NetconfMessage response1 = session.sendRpc(editConfigMsg).get();
        System.out.println("Edit-config Response:\n" + response1);

        // Step 4: Send get-config
        String getConfigXml = """
                <rpc xmlns="urn:ietf:params:xml:ns:netconf:base:1.0" message-id="102">
                  <get-config>
                    <source><running/></source>
                    <filter type="subtree">
                      <interfaces xmlns="urn:ietf:params:xml:ns:yang:ietf-interfaces"/>
                    </filter>
                  </get-config>
                </rpc>
                """;

        NetconfMessage getConfigMsg = new NetconfMessage(XmlUtil.readXmlToDocument(getConfigXml));
        NetconfMessage response2 = session.sendRpc(getConfigMsg).get();
        System.out.println("Get-config Response:\n" + response2);
    }
}
