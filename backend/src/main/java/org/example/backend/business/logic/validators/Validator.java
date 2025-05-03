package org.example.backend.business.logic.validators;

public interface Validator<T> {
    public void validate(T t);
}
