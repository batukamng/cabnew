package com.mram.base.exceptions.unknown;


import com.mram.base.exceptions.forbidden.ForbiddenException;

public class WtfException extends ForbiddenException {
    public WtfException() {
    }

    public WtfException(String message) {
        super(message);
    }
}
