<#assign downStatuses = ["DOWN", "TESTING", "DORMANT", "NOT_PRESENT", "LOWER_LAYER_DOWN"]>

<#if inputs['oper-status[0]'] == "UP">
  <#assign outputs['oper-status'] = "UP">
<#elseif downStatuses?seq_contains(inputs['oper-status[0]'])>
  <#assign outputs['oper-status'] = "DOWN">
<#else>
  <#assign outputs['oper-status'] = "UNKNOWN">
</#if>




<#assign output3>
<![CDATA[<response xmlns:ns="urn:ietf:params:xml:ns:netconf:base:1.0"
    xmlns:j="urn:ciena:params:xml:ns:yang:ciena-en:ciena-mef-gos-flow">
    <ns:data>
        <qos-flows>
            <qos-flow>
                <name>QF-INTEROP-UC1A-RT</name>
                <classifier-list-precedence>1</classifier-list-precedence>
                <meter-profile>1R2C_PD-1000_v01_CHILD</meter-profile>
                <parent-fp>FP4-INTEROP-UC1A-RT</parent-fp>
                <stats-collection>on</stats-collection>
            </qos-flow>
            <qos-flow>
                <name>QF-INTEROP-UC1B-RT</name>
                <classifier-list>1002-FD-INTEROP-UC1B-RT</classifier-list>
                <classifier-list-precedence>1</classifier-list-precedence>
                <meter-profile>1R2C_PD-1000_v01_CHILD</meter-profile>
                <parent-fp>FP4-INTEROP-UC1B-RT</parent-fp>
                <stats-collection>on</stats-collection>
            </qos-flow>
        </qos-flows>
    </ns:data>
</response>]]>
</#assign>

<#-- Parse the XML string into an XML document object -->
<#assign doc = output3?xml>

<#-- Access elements using XPath-like syntax on the parsed document -->
<#assign qosFlows = doc.response.data['qos-flows']['qos-flow']>

<#-- Now you can iterate over the qos-flow elements -->
<#list qosFlows as qosFlow>
    <#assign name = qosFlow.name>
    <#assign parentFP = qosFlow['parent-fp']>
    <#assign statsCollection = qosFlow['stats-collection']>

    <#-- Output the extracted data -->
    QoS Flow Name: ${name}<br>
    Parent FP: ${parentFP}<br>
    Stats Collection: ${statsCollection}<br><br>
</#list>

<#-- Debug output (optional) -->
<#-- abc-debug(["qos test:", qosFlows])> --%> 




<#assign xmlString><![CDATA[
<data>
  <item id="1">Value 1</item>
  <item id="2">Value 2</item>
  <item id="3">
    <nested>Nested Value</nested>
  </item>
</data>
]]></#assign>

<#assign data = xml(xmlString)>

<#-- Accessing elements -->
Item 1 ID: ${data.data.item[0].@id}
Item 1 Value: ${data.data.item[0]}
Item 2 Value: ${data.data.item[1]}
Item 3 Nested Value: ${data.data.item[2].nested}

<#-- Iterating over items -->
<ul>
  <#list data.data.item as item>
    <li>ID: ${item.@id}, Value: ${item}</li>
  </#list>
</ul>

<#-- Handling missing elements (important!) -->
<#if data.data.missingElement??>
  Missing element exists: ${data.data.missingElement} <#-- This won't execute -->
<#else>
  Missing element does NOT exist.
</#if>

<#-- More robust way to handle missing elements -->
${(data.data.item[3].nested)!""} <#-- Uses default value if missing -->
${data.data.item[3].nested?default("Default Value")} <#-- Another default value option -->

<#-- Outputting the entire XML structure (for debugging) -->
${data?string}













<#assign localMeter = "1R2C_BD-1000_v01" />

<#-- Find the indices of the delimiters -->
<#assign underscore1 = localMeter?index_of("_") />
<#assign hyphen = localMeter?index_of("-") />
<#assign underscore2 = localMeter?last_index_of("_") /> <#-- Find the last underscore -->

<#if underscore1 != -1 && hyphen != -1 && underscore2 != -1> <#-- Check if all delimiters exist -->
  <#assign svcClass = localMeter?substring(underscore1 + 1, hyphen) />
  <#assign cir = localMeter?substring(hyphen + 1, underscore2) />

  <p>Service Class: ${svcClass}</p>
  <p>Circuit: ${cir}</p>
<#else>
  <p>String format is incorrect.</p>
</#if>








<#assign localMeter = "1R2C_BD-1000_v01" /> <#-- Or the *exact* value from output -->
<#assign pattern1 = "1R2C_(?<svcClass>[A-Za-z]+)-(?<cir>\d+)_v01" />
<#assign matcher1 = localMeter?matches(pattern1) />

<#if matcher1?size gt 0>
  <p>Match found!</p>
  <p>First group: ${matcher1[0]}</p> <#-- Check if this works -->
  <p>Second group: ${matcher1[1]}</p> <#-- Check if this works -->
<#else>
  <p>No match.</p>  <#-- This will likely be the output -->
</#if>

<#-- Print matcher1 for debugging -->
<#if matcher1??><#list matcher1 as group><p>Group: ${group}</p></#list><#else><p>matcher1 is null</p></#if>






<#assign localMeter = "1R2C_BD-1000_v01" /> <#-- The string to match -->
<#assign pattern1 = "1R2C_([A-Za-z]+)-(\\d+)_v01" /> <#-- The regex -->

<#if localMeter?matches(pattern1)>
  <#assign groups = localMeter?groups />
  <#assign svcClass = groups[1] /> <#-- Get the first captured group -->
  <#assign cir = groups[2] />    <#-- Get the second captured group -->

  <p>Service Class: ${svcClass}</p>
  <p>Circuit: ${cir}</p>
<#else>
  <p>Pattern did not match.</p>
</#if>




<#assign localMeter = "1R2C_BD-1000_v01" /> <#-- The string to match -->
<#assign pattern1 = "1R2C_([A-Za-z]+)-(\\d+)_v01" /> <#-- The regex -->

<#assign matcher1 = localMeter?matches(pattern1) /> <#-- Perform the match -->

<#if matcher1>
  <#-- Access the captured groups -->
  <#assign groups = localMeter?groups />
  <#assign svcClass = groups[1] /> <#-- Get the first captured group -->
  <#assign cir = groups[2] />    <#-- Get the second captured group -->

  <p>Service Class: ${svcClass}</p>
  <p>Circuit: ${cir}</p>
<#else>
  <p>Pattern did not match.</p>
</#if>



<#assign localMeter = "1R2C_BD-1000_v01" /> <#-- The string to match -->
<#assign pattern1 = "1R2C_([A-Za-z]+)-(\\d+)_v01" /> <#-- The regex -->

<#assign matcher1 = localMeter?matches(pattern1) /> <#-- Perform the match -->

<#if matcher1?size gt 0> 
  <#-- Assign the captured groups -->
  <#assign svcClass = localMeter?groups(1) /> <#-- Get the first captured group -->
  <#assign cir = localMeter?groups(2) />     <#-- Get the second captured group -->

  <p>Service Class: ${svcClass}</p>
  <p>Circuit: ${cir}</p>
<#else>
  <p>Pattern did not match.</p>
</#if>




<#assign localMeter = "1R2C_BD-1000_v01" />
<#assign pattern1 = "1R2C_(?<svcClass>[A-Za-z]+)-(?<cir>\\d+)_v01" />
<#assign matcher1 = localMeter?matches(pattern1) />

<#if matcher1?size gt 0>
  <#assign svcClass = matcher1[0] />
  <#assign cir = matcher1[1] />

  Service Class: ${svcClass}
  Circuit: ${cir}
<#else>
  Pattern did not match.
</#if>





<#assign localMeter = "1R2C_SomeClass-123_v01">
<#assign isLocalMeterFound = false>
<#assign outputs = {} />

<#if localMeter?matches("^1R2C_(?<svcClass>[A-Za-z]+)-(?<cir>\\d+)_v01$")>
    <#assign isLocalMeterFound = true>
    <#assign svcClass = localMeter?groups["svcClass"]>
    <#assign cir = localMeter?groups["cir"]>
</#if>

<#if isLocalMeterFound>
    <#assign outputs["cos"] = "Logic to compute COS based on svcClass">
    <#assign outputs["cin"] = cir?number>
</#if>

<!-- Debug output -->
<pre>
isLocalMeterFound: ${isLocalMeterFound}
cos: ${outputs["cos"]!}
cin: ${outputs["cin"]!}
</pre>





<#function getValuesByPath xml path>
    <#-- Parse XML -->
    <#assign document = xml?interpretXml>
    
    <#-- Split the path -->
    <#assign nodes = path?split("/")>
    
    <#-- Traverse the XML -->
    <#assign current = document>
    <#list nodes as node>
        <#if current?hasContent>
            <#assign current = current[node]>
        </#if>
    </#list>
    
    <#-- Collect values -->
    <#list current as item>
        <#if item?isNode>
            <#assign result = result + [item?string]>
        </#if>
    </#list>
    <#return result>
</#function>

<#-- Use Function -->
<#assign xmlContent = file.readFile("/mnt/data/file-SUei9QgeABgLt8S5rrZexz")>
<#assign path = "maintenance-domain/maintenance-associations/maintenance-association-end-point">
<#assign values = getValuesByPath(xmlContent, path)>
