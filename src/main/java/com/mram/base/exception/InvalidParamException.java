package com.mram.base.exception;


public class InvalidParamException extends BadRequestException {

    public InvalidParamException(Long param) {
        super("invalid-param", new Object[]{param} );
    }
}
