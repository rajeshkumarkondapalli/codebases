drive-openapi-demo/
├── pom.xml
└── src/
    └── main/
        ├── java/com/example/drive/
        │   ├── DriveApiApplication.java
        │   ├── model/DriveFile.java
        │   ├── controller/DriveController.java
        │   └── config/JacksonXmlConfig.java
        └── resources/
            └── application.properties

pom.xml

<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
         https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.example</groupId>
    <artifactId>drive-openapi-demo</artifactId>
    <version>1.0.0</version>

    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.3.2</version>
    </parent>

    <dependencies>
        <!-- REST API -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <!-- XML support -->
        <dependency>
            <groupId>com.fasterxml.jackson.dataformat</groupId>
            <artifactId>jackson-dataformat-xml</artifactId>
        </dependency>

        <!-- Swagger/OpenAPI -->
        <dependency>
            <groupId>org.springdoc</groupId>
            <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
            <version>2.3.0</version>
        </dependency>
    </dependencies>
</project>



package com.example.drive;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class DriveApiApplication {
    public static void main(String[] args) {
        SpringApplication.run(DriveApiApplication.class, args);
    }
}

package com.example.drive.model;

public class DriveFile {
    private String id;
    private String name;
    private long size;

    public DriveFile() {}

    public DriveFile(String id, String name, long size) {
        this.id = id;
        this.name = name;
        this.size = size;
    }

    public String getId() { return id; }
    public String getName() { return name; }
    public long getSize() { return size; }
}


package com.example.drive.controller;

import com.example.drive.model.DriveFile;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/drive")
public class DriveController {

    @GetMapping(
        value = "/files",
        produces = { MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE }
    )
    @Operation(
        summary = "Get files from Drive",
        description = "Returns JSON by default or XML if requested via Accept header",
        responses = {
            @ApiResponse(
                responseCode = "200",
                description = "List of drive files",
                content = {
                    @Content(mediaType = "application/json",
                             array = @ArraySchema(schema = @Schema(implementation = DriveFile.class))),
                    @Content(mediaType = "application/xml",
                             array = @ArraySchema(schema = @Schema(implementation = DriveFile.class)))
                }
            )
        }
    )
    public List<DriveFile> getFiles() {
        return List.of(
            new DriveFile("1", "Document.pdf", 1048576),
            new DriveFile("2", "Image.jpg", 512000)
        );
    }
}


package com.example.drive.config;

import com.fasterxml.jackson.dataformat.xml.XmlMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class JacksonXmlConfig {

    @Bean
    public XmlMapper xmlMapper() {
        XmlMapper mapper = new XmlMapper();
        mapper.setDefaultUseWrapper(false);
        return mapper;
    }
}

server.port=8080

# Make JSON default when Accept header missing
spring.mvc.contentnegotiation.favor-parameter=false
spring.mvc.contentnegotiation.ignore-accept-header=false
spring.mvc.contentnegotiation.media-types.json=application/json
spring.mvc.contentnegotiation.default-content-type=application/json


mvn spring-boot:run
Swagger UI → http://localhost:8080/swagger-ui/index.html

JSON default → curl http://localhost:8080/api/drive/files

XML request → curl -H "Accept: application/xml" http://localhost:8080/api/drive/files


