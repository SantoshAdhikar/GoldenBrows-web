package com.goldenbrows.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.Customizer;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfig {

	@Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(Customizer.withDefaults())
            .authorizeHttpRequests(auth -> auth
                // Allow CORS preflight
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                // 🔓 Public GET endpoints
                .requestMatchers(HttpMethod.GET, "/api/health").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/services/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/business-hours/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/employees/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/blog/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/contact/**").permitAll()

                // 🔓 Customers can create bookings *without* login
                .requestMatchers(HttpMethod.POST, "/api/appointments").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/appointments/**").permitAll()

                // 🔓 Blog comments are also public
                .requestMatchers(HttpMethod.POST, "/api/blog/*/comments").permitAll()

                // 🔐 Admin-only writes: services, employees, contact, blog posts, etc.
                .requestMatchers(HttpMethod.PUT,  "/api/contact/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.POST, "/api/services/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.POST, "/api/employees/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.POST, "/api/blog").hasRole("ADMIN")        // create post
                .requestMatchers(HttpMethod.PUT,  "/api/blog/**").hasRole("ADMIN")     // edit post
                .requestMatchers(HttpMethod.DELETE, "/api/blog/**").hasRole("ADMIN")   // delete post
                .requestMatchers(HttpMethod.PUT, "/api/services/**").authenticated()
                .requestMatchers(HttpMethod.DELETE, "/api/services/**").authenticated()
                .requestMatchers("/api/employees/**").hasRole("ADMIN")

                .requestMatchers(HttpMethod.PUT,   "/api/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PATCH, "/api/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE,"/api/**").hasRole("ADMIN")
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .requestMatchers("/api/blog/admin/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/blog/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PATCH, "/api/blog/**").hasRole("ADMIN")
                

                // Everything else: no auth needed (frontend assets, etc.)
//                .anyRequest().permitAll()
                .anyRequest().authenticated()
            )
            .httpBasic(Customizer.withDefaults());

        return http.build();
    }


    @Bean
    public UserDetailsService userDetailsService(PasswordEncoder passwordEncoder) {
        // TODO: change this password to something strong in real usage
        UserDetails admin = User.withUsername("admin")
                .password(passwordEncoder.encode("ChangeThisPassword123!"))
                .roles("ADMIN")
                .build();

        return new InMemoryUserDetailsManager(admin);
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        // DEV ONLY: allow everything. Later we can tighten this.
        config.setAllowedOriginPatterns(List.of("*"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

}
