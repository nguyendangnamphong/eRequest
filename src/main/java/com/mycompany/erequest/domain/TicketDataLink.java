package com.mycompany.erequest.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A TicketDataLink.
 */
@Entity
@Table(name = "ticket_data_link")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class TicketDataLink implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "node_id", nullable = false)
    private Long nodeId;

    @NotNull
    @Column(name = "form_data_id", nullable = false)
    private String formDataId;

    @Column(name = "parent_form_data_id")
    private String parentFormDataId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "steps", "dataLinks", "relations", "attachments", "slas", "comments" }, allowSetters = true)
    private Ticket ticket;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public TicketDataLink id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getNodeId() {
        return this.nodeId;
    }

    public TicketDataLink nodeId(Long nodeId) {
        this.setNodeId(nodeId);
        return this;
    }

    public void setNodeId(Long nodeId) {
        this.nodeId = nodeId;
    }

    public String getFormDataId() {
        return this.formDataId;
    }

    public TicketDataLink formDataId(String formDataId) {
        this.setFormDataId(formDataId);
        return this;
    }

    public void setFormDataId(String formDataId) {
        this.formDataId = formDataId;
    }

    public String getParentFormDataId() {
        return this.parentFormDataId;
    }

    public TicketDataLink parentFormDataId(String parentFormDataId) {
        this.setParentFormDataId(parentFormDataId);
        return this;
    }

    public void setParentFormDataId(String parentFormDataId) {
        this.parentFormDataId = parentFormDataId;
    }

    public Ticket getTicket() {
        return this.ticket;
    }

    public void setTicket(Ticket ticket) {
        this.ticket = ticket;
    }

    public TicketDataLink ticket(Ticket ticket) {
        this.setTicket(ticket);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof TicketDataLink)) {
            return false;
        }
        return getId() != null && getId().equals(((TicketDataLink) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "TicketDataLink{" +
            "id=" + getId() +
            ", nodeId=" + getNodeId() +
            ", formDataId='" + getFormDataId() + "'" +
            ", parentFormDataId='" + getParentFormDataId() + "'" +
            "}";
    }
}
