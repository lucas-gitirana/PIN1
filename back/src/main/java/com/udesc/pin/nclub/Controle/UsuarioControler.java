package com.udesc.pin.nclub.Controle;

import com.udesc.pin.nclub.Repositorio.UsuarioRepository;
import com.udesc.pin.nclub.model.Usuario;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;


/*DROP SCHEMA public CASCADE;
CREATE SCHEMA public;*/
@RestController
@RequestMapping("/usuario")
public class UsuarioControler {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @PostMapping("/create")
    public ResponseEntity<Usuario> createUsuario(@Valid @RequestBody Usuario usuario){
        Usuario savedUsuario = usuarioRepository.save(usuario);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(savedUsuario.getUsuarioId())
                .toUri();
        return ResponseEntity.created(location).build();
    }

}
