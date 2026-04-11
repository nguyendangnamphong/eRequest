package com.mycompany.erequest.domain;

import static com.mycompany.erequest.domain.TicketCommentTestSamples.*;
import static com.mycompany.erequest.domain.TicketTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.erequest.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class TicketCommentTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(TicketComment.class);
        TicketComment ticketComment1 = getTicketCommentSample1();
        TicketComment ticketComment2 = new TicketComment();
        assertThat(ticketComment1).isNotEqualTo(ticketComment2);

        ticketComment2.setId(ticketComment1.getId());
        assertThat(ticketComment1).isEqualTo(ticketComment2);

        ticketComment2 = getTicketCommentSample2();
        assertThat(ticketComment1).isNotEqualTo(ticketComment2);
    }

    @Test
    void ticketTest() {
        TicketComment ticketComment = getTicketCommentRandomSampleGenerator();
        Ticket ticketBack = getTicketRandomSampleGenerator();

        ticketComment.setTicket(ticketBack);
        assertThat(ticketComment.getTicket()).isEqualTo(ticketBack);

        ticketComment.ticket(null);
        assertThat(ticketComment.getTicket()).isNull();
    }
}
