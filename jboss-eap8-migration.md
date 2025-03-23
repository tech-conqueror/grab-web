# Migration and Dependency Upgrades

## 1. Migrate from Java 8 to Java 17

```xml
<plugin>
  <groupId>org.openrewrite.maven</groupId>
  <artifactId>rewrite-maven-plugin</artifactId>
  <version>6.3.2</version>
  <configuration>
    <activeRecipes>
      <recipe>org.openrewrite.java.migrate.UpgradeToJava17</recipe>
    </activeRecipes>
  </configuration>
  <dependencies>
    <dependency>
      <groupId>org.openrewrite.recipe</groupId>
      <artifactId>rewrite-migrate-java</artifactId>
      <version>3.4.0</version>
    </dependency>
  </dependencies>
</plugin>
```

## 2. Migrate from JavaEE to JakartaEE

```xml
<plugin>
  <groupId>org.openrewrite.maven</groupId>
  <artifactId>rewrite-maven-plugin</artifactId>
  <version>6.3.2</version>
  <configuration>
    <activeRecipes>
      <recipe>org.openrewrite.java.migrate.jakarta.JakartaEE10|org.openrewrite.java.migrate.jakarta.UpdateJakartaPlatform10</recipe>
    </activeRecipes>
  </configuration>
  <dependencies>
    <dependency>
      <groupId>org.openrewrite.recipe</groupId>
      <artifactId>rewrite-migrate-java</artifactId>
      <version>3.4.0</version>
    </dependency>
  </dependencies>
</plugin>
```

### Upgrade the dependency version for jakarta.annotation-api (Optional)
```xml
<dependency>
    <groupId>jakarta.annotation</groupId>
    <artifactId>jakarta.annotation-api</artifactId>
    <version>3.0.0</version>
</dependency>
```

### Add jakarta.jakartaee-api as dependency (Optional)
```xml
<dependency>
    <groupId>jakarta.platform</groupId>
    <artifactId>jakarta.jakartaee-api</artifactId>
    <version>10.0.0</version>
    <scope>provided</scope>
</dependency>
```

## 3. Migrate from Log4j to SLF4J

```xml
<plugin>
  <groupId>org.openrewrite.maven</groupId>
  <artifactId>rewrite-maven-plugin</artifactId>
  <version>6.3.2</version>
  <configuration>
    <activeRecipes>
      <recipe>org.openrewrite.java.logging.slf4j.Log4jToSlf4j</recipe>
    </activeRecipes>
  </configuration>
  <dependencies>
    <dependency>
      <groupId>org.openrewrite.recipe</groupId>
      <artifactId>rewrite-logging-frameworks</artifactId>
      <version>3.4.0</version>
    </dependency>
  </dependencies>
</plugin>
```

## 4. Upgrade Prometheus Dependencies

```xml
<dependency>
  <groupId>io.prometheus</groupId>
  <artifactId>simpleclient_hotspot</artifactId>
  <version>0.16.0</version>
</dependency>
<dependency>
  <groupId>io.prometheus</groupId>
  <artifactId>simpleclient_servlet</artifactId>
  <version>0.16.0</version>
</dependency>
```

