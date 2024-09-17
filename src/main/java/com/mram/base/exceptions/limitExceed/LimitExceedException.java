package com.mram.base.exceptions.limitExceed;


import com.mram.base.exceptions.invalid.InvalidException;

public class LimitExceedException extends InvalidException {
    public LimitExceedException() {
    }

    public LimitExceedException(String message) {
        super(message);
    }

}
